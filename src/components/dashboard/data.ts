import { BookOpen, Home,  Users } from "lucide-react";

const dashboardNavList=[
    {
        href:"/dashboard",
        Icon:Home,
        title:"Home"
    },
     {
        href:"/dashboard/customers",
        Icon:Users,
        title:"Customers"
    },
     {
        href:"/dashboard/invoices",
        Icon:BookOpen,
        title:"Invoices"
    },
]

export {dashboardNavList}