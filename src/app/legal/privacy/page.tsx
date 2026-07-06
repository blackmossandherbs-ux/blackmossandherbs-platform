export default function PrivacyPage() {
    return (
        <div className="py-20 bg-earth-50 min-h-screen">
            <div className="container max-w-4xl text-earth-800">
                <h1 className="font-serif text-4xl font-bold mb-8 text-earth-900">Privacy Policy</h1>
                <div className="prose prose-earth max-w-none">
                    <p className="lead">Last Updated: January 2025</p>
                    <p>
                        At Black Moss & Herbs (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), we are committed to protecting your personal information and your right to privacy.
                        This policy outlines how we collect, use, and safeguard your data.
                    </p>

                    <h3>1. Information We Collect</h3>
                    <p>
                        We collect personal information that you voluntarily provide to us when you register on the website,
                        express an interest in obtaining information about us or our products and services, when you participate
                        in activities on the website (such as by posting messages in our online forums or entering competitions,
                        contests or giveaways) or otherwise when you contact us.
                    </p>
                    <ul>
                        <li><strong>Personal Data:</strong> Name, email address, phone number, billing/shipping address.</li>
                        <li><strong>Health Data:</strong> (Optional) Health goals and dietary preferences provided in your Wellness Dashboard. This is encrypted and used solely for personalization.</li>
                        <li><strong>Payment Data:</strong> We do not store credit card details. All transactions are processed via Stripe authentication.</li>
                    </ul>

                    <h3>2. How We Use Your Information</h3>
                    <p>We use personal information collected via our website for a variety of business purposes described below:</p>
                    <ul>
                        <li>To facilitate account creation and logon process.</li>
                        <li>To send you marketing and promotional communications (with your consent).</li>
                        <li>To fulfill and manage your orders.</li>
                        <li>To protect our Services (Security & Fraud Prevention).</li>
                    </ul>

                    <h3>3. Data Security</h3>
                    <p>
                        We have implemented appropriate technical and organizational security measures to protect the security of any personal information we process.
                        However, please also remember that we cannot guarantee that the internet itself is 100% secure.
                    </p>

                    <h3>4. Contact Us</h3>
                    <p>If you have questions or comments about this policy, you may email us at support@blackmossandherbs.com.</p>
                </div>
            </div>
        </div>
    )
}
