import  { useEffect, useState } from 'react'

// import DrawerList from './DrawerList'
import Navbar from '../../../admin seller/components/navbar/Navbar'
import AdminDrawerList from '../../components/DrawerList'
import { Alert, Snackbar } from '@mui/material'
import { useAppSelector } from '../../../Redux Toolkit/Store'
// import AdminAppRoutes from '../../AdminAppRoutes'
// import Layout from '../../components/Layout'
import AdminRoutes from '../../../routes/AdminRoutes'

const AdminDashboard = () => {
  const { admin } = useAppSelector(store => store)
  const [snackbarOpen, setOpenSnackbar] = useState(false);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  }
  // useEffect(() => {
  //   if (deal.dealCreated || deal.dealUpdated ||deal.error || admin.categoryUpdated) {
  //     setOpenSnackbar(true)
  //   }
  // }, [deal.dealCreated, deal.dealUpdated, deal.error,admin.categoryUpdated])
  return (
    <>
      <div className="min-h-screen">
        <Navbar DrawerList={AdminDrawerList} />
        <section className="lg:flex lg:h-[90vh]">
          <div className="hidden lg:block h-full">
            <AdminDrawerList />
          </div>
          <div className="p-10 w-full lg:w-[80%]  overflow-y-auto">
            <AdminRoutes/>
          </div>
        </section>

      </div>
      {/* <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={snackbarOpen} autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={admin.error ? "error" : "success"}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {admin.error ? admin.error : admin.dealCreated ? "Deal created successfully" : admin.dealUpdated ? "deal updated successfully" : admin.categoryUpdated?"Category Updated successfully": ""}
        </Alert>
      </Snackbar> */}
    </>



  )
}

export default AdminDashboard