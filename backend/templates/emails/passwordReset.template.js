export const passwordResetTemplate = (otp) => {

    return `

        <div style="font-family:Arial,sans-serif;padding:20px">

            <h2 style="color:#2E7D32">
                Reset Password
            </h2>

            <p>

                We received a password reset request.

            </p>

            <p>

                Your OTP is

            </p>

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

                If you didn't request this,
                simply ignore this email.

            </p>

        </div>

    `;

};