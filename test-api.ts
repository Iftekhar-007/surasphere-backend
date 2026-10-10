import { envVars } from "./src/config/env";

async function test() {
  try {
    const adminEmail = envVars.ADMIN.EMAIL;
    const adminPassword = envVars.ADMIN.PASSWORD;

    console.log("Signing in as admin:", adminEmail);
    const signInRes = await fetch("http://localhost:5000/api/auth/sign-in/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: adminEmail, password: adminPassword }),
    });

    const cookieHeader = signInRes.headers.get("set-cookie");
    const signData = await signInRes.json();
    console.log("Sign in status:", signInRes.status, "User:", signData?.user?.email);

    // Get students list
    const studentsRes = await fetch("http://localhost:5000/api/v1/admin/students", {
      headers: {
        "Cookie": cookieHeader || "",
      }
    });
    const studentsData = await studentsRes.json();
    console.log("Students API status:", studentsRes.status, "Count:", studentsData.data?.length);

    if (studentsData.data?.length > 0) {
      const student = studentsData.data[0];
      console.log("Attempting to verify student:", student.id, student.user?.name);
      
      const verifyRes = await fetch("http://localhost:5000/api/v1/admin/verify-student", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Cookie": cookieHeader || "",
        },
        body: JSON.stringify({
          studentProfileId: student.id,
          status: "VERIFIED",
        }),
      });

      const verifyData = await verifyRes.json();
      console.log("Verify API status:", verifyRes.status, "Response:", JSON.stringify(verifyData, null, 2));
    }
  } catch (err) {
    console.error("Test Error:", err);
  }
}

test();
