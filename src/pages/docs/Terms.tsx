import { Box, Link, List, ListItem, Typography } from "@mui/material";
import React from "react";

export default function Terms() {
  return (
    <Box className="p-20">
      <div>
        <Typography
          variant="h6"
          gutterBottom
          className="h-20 w-full bg-primary-button text-center text-white "
        >
          Terms and Conditions
        </Typography>

        <Typography variant="body1" gutterBottom>
          By accessing and using our service, you accept and agree to be bound
          by the following terms and conditions.
        </Typography>

        <Typography variant="body1" gutterBottom>
          <b>1. User Account:</b>
          <ul>
            <li>
              You are responsible for maintaining the confidentiality of your
              account and password and for restricting access to your account.
              You agree to accept responsibility for all activities that occur
              under your account or password.
            </li>
          </ul>
        </Typography>

        <Typography variant="body1" gutterBottom>
          <b>2. Advertisement:</b>
          <ul>
            <li>
              Our service may display advertisements, and by using our service,
              you agree to the placement of such advertisements. These
              advertisements may use cookies or other technologies to collect
              information about your interests and serve targeted ads.
            </li>
            <li>
              We are not responsible for the content or accuracy of any
              advertisements displayed on our service, nor do we endorse the
              products or services advertised.
            </li>
          </ul>
        </Typography>

        <Typography variant="body1" gutterBottom>
          <b>3. Usage and Termination:</b>
          <ul>
            <li>
              Misuse of our service, including but not limited to violating any
              applicable laws or regulations or engaging in fraudulent
              activities, may result in immediate termination of your access to
              the service.
            </li>
            <li>
              We reserve the right to terminate or suspend your access to the
              service at any time, without prior notice or liability.
            </li>
          </ul>
        </Typography>

        <Typography variant="body1" gutterBottom>
          <b>4. Public URL:</b>
          <ul>
            <li>
              You have the option to create a public URL for your instance. By
              sharing this URL, you understand and agree that visitors to the
              URL will be served with advertisements as part of our service.
            </li>
            <li>
              We are not responsible for the content or actions of any visitors
              to your public URL. You are solely responsible for the use and
              consequences of sharing your public URL.
            </li>
          </ul>
        </Typography>

        <Typography variant="body1" gutterBottom>
          <b>5. Modification of Terms:</b>
          <br />
          We reserve the right to modify or update these terms and conditions at
          any time, without prior notice. By continuing to use our service after
          any modifications or updates, you agree to be bound by the revised
          terms and conditions.
        </Typography>
      </div>
      <div>
        <Typography variant="h6" gutterBottom>
          Privacy Policy
        </Typography>

        <Typography variant="body1" gutterBottom>
          This Privacy Policy explains how we collect, use, and disclose your
          personal information when you use our service. By using our service,
          you consent to the collection, use, and disclosure of your personal
          information as described in this policy.
        </Typography>

        <Typography variant="body1" gutterBottom>
          <b>1. Information Collection and Use:</b>
          <ul>
            <li>
              Google Account: When you sign in to our service using your Google
              account, we may collect certain information associated with your
              account, such as your name and email address. We use this
              information for authentication purposes and to provide
              personalized features.
            </li>
            <li>
              Session Management: We may collect and store information about
              your session activity to facilitate the use of our service and
              ensure its proper functioning.
            </li>
          </ul>
        </Typography>

        <Typography variant="body1" gutterBottom>
          <b>2. Data Sharing and Disclosure:</b>
          <ul>
            <li>
              Third-Party Advertising: We may work with third-party advertising
              partners to display advertisements on our service. These partners
              may use cookies and similar technologies to collect information
              about your visits to our website and other websites to provide
              targeted advertising. We do not control the data collected by
              these third parties, and their use of your information is subject
              to their own privacy policies.
            </li>
            <li>
              Data Transfer: In order to provide our service, we may transfer
              your personal information to servers located in different
              countries. By using our service, you consent to the transfer of
              your information to these servers.
            </li>
            <li>
              Legal Requirements: We may disclose your personal information if
              required to do so by law or in response to valid legal requests,
              such as court orders or government regulations.
            </li>
          </ul>
        </Typography>

        <Typography variant="body1" gutterBottom>
          <b>3. Data Security:</b>
          <br />
          We take reasonable measures to protect your personal information from
          unauthorized access, use, or disclosure. However, no data transmission
          over the internet or storage system can be guaranteed to be 100%
          secure. We cannot ensure the security of your personal information.
        </Typography>

        <Typography variant="body1" gutterBottom>
          <b>4. Data Retention:</b>
          <br />
          We retain your personal information for as long as necessary to
          fulfill the purposes outlined in this privacy policy, unless a longer
          retention period is required or permitted by law.
        </Typography>

        <Typography variant="body1" gutterBottom>
          <b>5. Your Rights:</b>
          <br />
          You have the right to access, update, and delete your personal
          information. If you would like to exercise any of these rights, please
          contact us using the information provided below.
        </Typography>

        <Typography variant="body1" gutterBottom>
          <b>6. Changes to the Privacy Policy:</b>
          <br />
          We reserve the right to modify or update this privacy policy at any
          time, without prior notice. Any changes will be effective immediately
          upon posting the updated privacy policy on our website.
        </Typography>

        <Typography variant="body1" gutterBottom>
          If you have any questions or concerns about these terms and
          conditions, please contact us on{" "}
          <Link href="https://discordapp.com/users/1127377226548117585">
            Discord
          </Link>
        </Typography>
      </div>
    </Box>
  );
}
