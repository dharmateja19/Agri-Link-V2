export const verificationTemplate = (otp) => {
    return `
        <div style="font-family:Arial,sans-serif;padding:20px">

            <h2 style="color:#2E7D32">
                Welcome to AgriLink 🌱
            </h2>

            <p>
                Thank you for registering.
            </p>

            <p>Your OTP is</p>

            <h1
                style="
                    letter-spacing:6px;
                    color:#2E7D32;
                "
            >
                ${otp}
            </h1>

            <p>
                Valid for 5 minutes.
            </p>

            <p>
                Ignore this email if you didn't register.
            </p>

        </div>
    `;
};