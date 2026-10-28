import ProductProvider from "./CartProvider";
import AlertProvider from "./AlertProvider";
import UserProvider from "./UserProvider";
import ThemeProvider from "./ThemeProvider";
import WishlistProvider from "./WishlistProvider";
import CheckoutProvider from "./CheckoutProvider";
import AdminProvider from "./Adminprovider";
import ReviewProvider from "./ReviewProvider";
import OrdersProvider from "./OrdersContext";

export default function ContextProviders({children}) {
  return (
    <ThemeProvider>
      <AlertProvider>
        <UserProvider>
          <AdminProvider>
            <ReviewProvider>
              <CheckoutProvider>
                <OrdersProvider>
                  <ProductProvider>
                    <WishlistProvider>
                      {children}
                    </WishlistProvider>
                  </ProductProvider>
                </OrdersProvider>
              </CheckoutProvider>
            </ReviewProvider>
          </AdminProvider>
        </UserProvider>
      </AlertProvider>
    </ThemeProvider>
  )
}
