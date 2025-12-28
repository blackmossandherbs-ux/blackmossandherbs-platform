import "./index";

// Keep process alive
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  process.exit(0);
});

console.log("Queue worker started");
