import { redirect } from "next/navigation";

/**
 * Root route simply forwards users to the main dashboard since
 * the navigation highlights `/` as the dashboard entry point.
 */
export default function Home() {
  redirect("/dashboard");
}