// import { Outlet } from "react-router-dom";
// import AppHeader from "components/layout/app.header";
// import { useEffect } from "react";
// import { fetchAccountAPI } from "services/api";
// import { useCurrentApp } from "components/context/app.context";
// import { PacmanLoader } from "react-spinners";

// const Layout = () => {
//     const { setUser, isAppLoading, setIsAppLoading, setIsAuthenticated } = useCurrentApp()

//     useEffect(() => {
//         const fetchAccount = async () => {
//             setTimeout(async () => {
//                 const res = await fetchAccountAPI();
//                 if (res.data) {
//                     setUser(res.data.user)
//                     setIsAuthenticated(true)
//                 }
//                 setIsAppLoading(false)
//             }, 1000);
//         };
//         fetchAccount();
//     }, []);

//     return (
//         <>
//             {isAppLoading === false ?
//                 <div>
//                     <AppHeader></AppHeader>
//                     <Outlet></Outlet>
//                 </div>
//                 :
//                 <div style={{
//                     position: "fixed",
//                     top: "50%",
//                     left: "50%",
//                     transform: "translate(-50%, -50%)",
//                 }}>

//                     <PacmanLoader
//                         size={30}
//                         color="#36d6b4"
//                     />
//                 </div>
//             }
//         </>
//     )
// }

// export default Layout;

import { Outlet } from "react-router-dom";
import AppHeader from "./components/layout/app.header";

function Layout() {

    return (
        <div>
            <AppHeader />
            <Outlet />
        </div>
    )
}

export default Layout;
