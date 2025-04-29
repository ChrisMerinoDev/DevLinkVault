import { connectToDatabase } from "@/lib/mongoose";
import DashboardPage from "./dashboard/page";

export default async function Home() {
  await connectToDatabase();
  console.log("Connected to MongoDB ✅")
  
  return (
    <DashboardPage />
  );
}
