import { Mail, Phone, MapPin } from "lucide-react";
export const LinkData = [
    {
        icon: <Mail size={22} />,
        title: "Email Us",
        text: "mousaeseady@gmail.com",
        link: "mailto:mousaeseady@gmail.com",
    },
    {
        icon: <Phone size={22} />,
        title: "Call Us",
        text: "+970 595560240",
        link: "tel:+970595560240",
    },
    {
        icon: <MapPin size={22} />,
        title: "Headquarters",
        text: "Nexmart Hub, Suite 100, Gaza City",
        link: "https://maps.google.com/?q=Gaza+City",
    },
];

export const fieldsConfig = [
  {
    id: "name",
    label: "Your Name",
    type: "text",
    placeholder: "Enter your name",
  },
  {
    id: "email",
    label: "Your Email",
    type: "email",
    placeholder: "Enter your email",
  }
];