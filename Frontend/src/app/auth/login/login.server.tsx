// 'use server'
// import axios from "axios";
// // import { jwtDecode } from "jwt-decode";
// import { cookies } from "next/headers";
// // import { redirect } from "next/navigation";
// // import { FormError } from "@/app/common/form-error.interface";
// // import { API_URL } from "@/app/constants/api";
// // import { getErrorMessage } from "@/app/util/errors";

// export default async function login(formData: FormData) {
//     const res = await axios.post('http://localhost:5000/auth/login', {
//         email:formData.get('email'),
//         hash_pass: formData.get('password')
//         },{ withCredentials: true });
//       const parsedRes = await res.json();
//       if (!res.ok) {
//         return { error: (parsedRes) };
//       }
//       setAuthCookie(res);
//      // redirect("/");
//     }
    
//     const setAuthCookie = async (response: Response) => {
//       const setCookieHeader = response.headers.get("Set-Cookie");
//       if (setCookieHeader) {
//         const token = setCookieHeader.split(";")[0].split("=")[1];
//         (await cookies()).set({
//           name: "Authentication",
//           value: token,
//           secure: false,
//           httpOnly: false,
//           sameSite:'lax',
//           maxAge: 36000,
//         });
//       }
// }
