import { Mail, Phone, MapPin } from "lucide-react";

export const LinkData = [
    {
        icon: <Mail size={22} />,
        title: "emailUs",
        text: "mousaeseady@gmail.com",
        link: "mailto:mousaeseady@gmail.com",
        isTranslationText: false,
    },
    {
        icon: <Phone size={22} />,
        title: "callUS",
        text: "+970 595560240",
        link: "tel:+970595560240",
        isTranslationText: false,
    },
    {
        icon: <MapPin size={22} />,
        title: "Headquarters.title",
        text: "Headquarters.Desc",
        link: "https://maps.google.com/?q=Gaza+City",
        isTranslationText: true,
    },
];

export const fieldsConfig = [
  {
    id: "name",
    label: "Name.label",
    type: "text",
    placeholder: "Name.placeholder",
  },
  {
    id: "email",
    label: "email.label",
    type: "email",
    placeholder: "email.placeholder",
  }
];