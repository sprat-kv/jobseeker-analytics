"use client"; 
import Head from "next/head";
import Image from "next/image";
import { Button } from "@heroui/react"; 
import { useRouter } from "next/navigation"; 
import { GoogleIcon } from "@/components/icons";
const GoogleLogin = () => {
  const router = useRouter();

  const handleGoogleLogin = () => {
    router.push("http://localhost:8000/login"); 
  };

  return (
    <Button
      className="text-sm font-normal text-default-600 bg-default-100"
      startContent={<GoogleIcon className="text-danger" />}
      variant="flat"
      onClick={handleGoogleLogin}
    >
      Login with Google
    </Button>
  );
};

export default function HomePage() {
  return (
    <>
      <Head>
        <title>jobba.help</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-title" content="jobba.help" />
        <link rel="manifest" href="/static/site.webmanifest" />
      </Head>

      <main className="max-w-2xl mx-auto p-6 shadow-md rounded-lg">
        <h2 className="text-2xl font-bold">Did you email us yet? No?</h2>
        <p>
          To beta test,{" "}
          <a href="mailto:help@jobba.help?subject=JobbaHelp%20Free%20Trial&body=my%20google%20gmail%20address%20is" className="text-blue-600 hover:underline">
            send us an email
          </a>.
        </p>
        <ol className="list-decimal ml-6">
          <li>Mention how you heard about the app (which community, friend’s name).</li>
          <li>We’ll respond as soon as possible to give you access.</li>
        </ol>

        <h2 className="text-2xl font-bold mt-6">Did you get a confirmation email? Ready to start?</h2>
        <div className="mt-4 flex">
        <GoogleLogin /> 
        </div>
        <div className="flex justify-center mt-6">
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/-cOKR4JtceY"
            title="YouTube video player"
            allowFullScreen
            className="rounded-lg shadow-md"
          ></iframe>
        </div>

        <h2 className="text-2xl font-bold mt-6">What's this about?</h2>
        <p className="text-center text-3xl">↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓</p>

        <h2 className="text-2xl font-bold mt-6">"What’s special about another job tracker spreadsheet?"</h2>
        <p>The spreadsheet is <strong>automagically updated</strong>—you don’t need to update it manually.</p>
        <p>Log in with Google, and bam! The spreadsheet is generated for you.</p>

        <h2 className="text-2xl font-bold mt-6">"Are you reading my emails?!"</h2>
        <p>Nope! The app simply fetches relevant job application emails and logs them.</p>

        <h2 className="text-2xl font-bold mt-6">How does it work?</h2>
        <p>When you log in with Google, the app gets a temporary access token for fetching job-related emails.</p>

        <pre className="p-4 rounded-lg text-sm mt-4 whitespace-pre-wrap break-words">
          {'\'(subject:"thank" AND from:"no-reply@ashbyhq.com") OR \n' +
            '\'(subject:"thank" AND from:"careers@") OR \n' +
            '\'subject:"application received" OR \n' +
            '\'subject:"we received your application" OR \n' +
            '\'subject:"thank you for your application"'}
        </pre>

        <h2 className="text-2xl font-bold mt-4">Your data will look something like this:</h2>
        <div className="mt-6 flex justify-center">
          <Image
            src="/excel_ss.png"
            alt="Spreadsheet Example"
            width={700}
            height={400}
            className="rounded-lg shadow-md"
          />
        </div>

        <h2 className="text-2xl font-bold mt-6">Did you email us yet?</h2>
        <p>
          To beta test,{" "}
          <a href="mailto:help@jobba.help?subject=JobbaHelp%20Free%20Trial&body=my%20google%20gmail%20address%20is" className="text-blue-600 hover:underline">
            send us an email
          </a>.
        </p>
      </main>
    </>
  );
}
