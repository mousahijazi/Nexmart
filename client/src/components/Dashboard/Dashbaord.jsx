import { CartDashboard, Userdashboard, WishlistDashboard, OrderDashboard, AdminDashboard } from "../../index";

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
    
    case "adminDashboard":
      return (
        <AdminDashboard />
      );

    case "wishlistDashboard":
      return (
        <WishlistDashboard />
      );
    
    case "orderDashboard":
      return(
        <OrderDashboard />
      );

    default:
      return null;
  }
}
