// // src/routes/adminRoutes.jsx
// import React from 'react';
// import { Navigate } from 'react-router-dom';
// import AuthGuard from '@/guards/AuthGuard';
// import RoleGuard from '@/guards/RoleGuard';
// import AdminLayout from '@/layouts/AdminLayout';
// import AdminDashboard from '@/pages/admin/Dashboard';
// import AdminUsers from '@/pages/admin/Users';
// import AdminProducts from '@/pages/admin/Products';
// import AdminSettings from '@/pages/admin/Settings';

// const adminRoutes = {
//   path: '/admin',
//   element: (
//     <AuthGuard>
//       <RoleGuard allowedRoles={['admin']}>
//         <AdminLayout />
//       </RoleGuard>
//     </AuthGuard>
//   ),
//   children: [
//     { index: true, element: <Navigate to="/admin/dashboard" replace /> },
//     { path: 'dashboard', element: <AdminDashboard /> },
//     { path: 'users', element: <AdminUsers /> },
//     { path: 'products', element: <AdminProducts /> },
//     { path: 'settings', element: <AdminSettings /> },
//   ],
// };

// export default adminRoutes;
