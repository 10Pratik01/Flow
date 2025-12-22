"use client"; 
import { useGetUsersQuery} from '@/state/api'
import { useAppSelector } from '../redux';
import Loader from '../(components)/Loader';
import Header from '../(components)/Header';
import { DataGrid, } from '@mui/x-data-grid';
import { dataGridClassNames, dataGridSxStyles } from '@/lib/utils';
import Image from 'next/image';
import { GridColDef } from '@mui/x-data-grid';



const Users = () => {
    const {data:users, isLoading, isError} = useGetUsersQuery(); 
    const isDarkMode = useAppSelector((state) => state.global.isDarkMode)

    if (isLoading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground h-full w-full mt-2"><Loader/></div>
      </div>
    )
  if (isError)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-destructive">Error loading Users</div>
      </div>
    )
  

const columns: GridColDef[] = [
  { field: "userId", headerName: "ID", width: 100 },
  { field: "username", headerName: "Username", width: 150 },
  {
    field: "profilePictureUrl",
    headerName: "Profile Picture",
    width: 100,
    renderCell: (params) => (
      <div className="flex h-full w-full items-center justify-center">
        <div className="h-9 w-9">
          <Image
            src={`/${params.value}`}
            alt={params.row.username}
            width={100}
            height={50}
            className="h-full rounded-full object-cover"
          />
        </div>
      </div>
    ),
  },
  {
    field:"teamId", headerName:"TeamId", width: 100, 
  }
];


  return (
     <div className="flex w-screen p-10 flex-col">
      <Header name="Users" />
      <div className='flex justify-start '>
        <div  className='flex h-[650px] w-screen md:w-[450px] overflow-auto no-scrollbar'>
          <DataGrid 
            rows={users || []}
            columns={columns}
            getRowId={(row) => row.userId}
            pageSizeOptions={[5, 10, 25]}
            pagination
            className={dataGridClassNames}
            sx={dataGridSxStyles(isDarkMode)}
          /> 
        </div>
      </div>
    </div>
  )
}

export default Users