"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, Input, Label } from "@blackmoss/ui";
import { PractitionerProfile } from "@prisma/client";
import { useRouter } from "next/navigation";
import { format, addDays, startOfWeek, addWeeks } from "date-fns";

const bookingSchema = z.object({
  scheduledAt: z.string(),
  intakeForm: z.record(z.any()).optional(),
  consentAccepted: z.boolean().refine((val) => val === true, "You must accept the terms"),
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  practitioner: PractitionerProfile & {
    schedules: Array<{
      dayOfWeek: number;
      startTime: string;
      endTime: string;
      timezone: string;
    }>;
  };
  userId: string;
}

export function BookingForm({ practitioner, userId }: BookingFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
  });

  const consentAccepted = watch("consentAccepted");

  // Generate available dates (next 30 days)
  const availableDates = Array.from({ length: 30 }, (_, i) => addDays(new Date(), i));

  // Generate available times for selected date
  const getAvailableTimes = () => {
    if (!selectedDate) return [];

    const dayOfWeek = selectedDate.getDay();
    const daySchedule = practitioner.schedules.find((s) => s.dayOfWeek === dayOfWeek);

    if (!daySchedule) return [];

    const times: string[] = [];
    const [startHour, startMin] = daySchedule.startTime.split(":").map(Number);
    const [endHour, endMin] = daySchedule.endTime.split(":").map(Number);

    let currentHour = startHour;
    let currentMin = startMin;

    while (
      currentHour < endHour ||
      (currentHour === endHour && currentMin < endMin)
    ) {
      times.push(`${currentHour.toString().padStart(2, "0")}:${currentMin.toString().padStart(2, "0")}`);
      currentMin += 30;
      if (currentMin >= 60) {
        currentMin = 0;
        currentHour++;
      }
    }

    return times;
  };

  const onSubmit = async (data: BookingFormData) => {
    if (!selectedDate || !selectedTime) {
      return;
    }

    setLoading(true);
    try {
      // Combine date and time
      const [hours, minutes] = selectedTime.split(":").map(Number);
      const scheduledAt = new Date(selectedDate);
      scheduledAt.setHours(hours, minutes, 0, 0);

      const response = await fetch("/api/consultations/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          practitionerId: practitioner.id,
          scheduledAt: scheduledAt.toISOString(),
          intakeForm: data.intakeForm,
          consentAccepted: data.consentAccepted,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to book consultation");
      }

      const result = await response.json();
      router.push(`/consultations/${result.consultationId}`);
    } catch (error) {
      console.error("Booking error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
      <div>
        <Label>Select Date</Label>
        <div className="grid grid-cols-7 gap-2 mt-2">
          {availableDates.map((date) => {
            const dayOfWeek = date.getDay();
            const hasSchedule = practitioner.schedules.some((s) => s.dayOfWeek === dayOfWeek);
            const isSelected = selectedDate?.toDateString() === date.toDateString();

            return (
              <button
                key={date.toISOString()}
                type="button"
                onClick={() => {
                  setSelectedDate(date);
                  setSelectedTime(null);
                }}
                disabled={!hasSchedule}
                className={`p-2 rounded border ${
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : hasSchedule
                    ? "hover:bg-muted"
                    : "opacity-50 cursor-not-allowed"
                }`}
              >
                {format(date, "d")}
              </button>
            );
          })}
        </div>
      </div>

      {selectedDate && (
        <div>
          <Label>Select Time</Label>
          <div className="grid grid-cols-4 gap-2 mt-2">
            {getAvailableTimes().map((time) => (
              <button
                key={time}
                type="button"
                onClick={() => {
                  setSelectedTime(time);
                  const [hours, minutes] = time.split(":").map(Number);
                  const scheduledAt = new Date(selectedDate);
                  scheduledAt.setHours(hours, minutes, 0, 0);
                  setValue("scheduledAt", scheduledAt.toISOString());
                }}
                className={`p-2 rounded border ${
                  selectedTime === time
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <Label>
          <input
            type="checkbox"
            {...register("consentAccepted")}
            className="mr-2"
          />
          I accept the terms and conditions and privacy policy
        </Label>
        {errors.consentAccepted && (
          <p className="text-sm text-destructive mt-1">{errors.consentAccepted.message}</p>
        )}
      </div>

      <Button type="submit" disabled={loading || !selectedDate || !selectedTime} className="w-full">
        {loading ? "Booking..." : "Book Consultation"}
      </Button>
    </form>
  );
}
