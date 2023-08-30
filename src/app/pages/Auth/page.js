"use client"

import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../firebaseConfig/firebaseConfig"
import { useRouter } from 'next/navigation'

export default function Auth() {

    const router = useRouter();
    async function handleAuth() {
        try {
            const data = await signInWithPopup(auth, provider)
            router.push("/")
        }
        catch (err) {
            console.log(err)
        }
    }

    return (
        <>
            <button onClick={handleAuth}> Sign in With Google</button>
        </>
    )
}
