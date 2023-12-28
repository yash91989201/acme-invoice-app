import { Inter ,Lusitana} from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const lusitana=Lusitana({
weight:["400","700"],
subsets:["latin"]
})

export {inter,lusitana}