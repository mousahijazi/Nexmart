import { CartDashboard, Userdashboard, WishlistDashboard } from "@/index";

export default function Dashbaord({showData = "cartDashboard"}) {
  switch (showData) {
    case "cartDashboard":
      return (
        <CartDashboard />
      );
      
    case "userDashboard":
      return (
        <Userdashboard />
      );

    case "wishlistDashboard":
      return (
        <WishlistDashboard />
      );

    default:
      return null;
  }
}
