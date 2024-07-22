import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import DoneAllRoundedIcon from '@mui/icons-material/DoneAllRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

export default function AllOrders() {
    const [allOrders, setAllOrders] = useState([]);
    const [custId, setCustId] = useState('');
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [address, setAddress] = useState('');
    const navigate = useRouter();

    useEffect(() => {
        const isLoggedIn = JSON.parse(localStorage.getItem('user-data'));
        if (!isLoggedIn) {
            return navigate.replace('/components/signin');
        }
        if (isLoggedIn && !isLoggedIn.isAdmin) {
            return navigate.replace('/components/showAllProducts');
        }
    }, [navigate]);

    const fetchOrders = async () => {
        const response = await axios.get('/api/adminallorders');
        console.log("admin all prod", response);
        if (response) {
            console.log(response?.data?.data);
            setAllOrders(response?.data?.data);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleClickOpen = async (id) => {
        setCustId(id);
        const response = await axios.get(`/api/custumerinfo?id=${id}`);
        const userDetails = response?.data?.data;
        setName(userDetails.name);
        setEmail(userDetails.email);
        setPhone(userDetails.phone);
        setCity(userDetails.city);
        setCountry(userDetails.country);
        setAddress(userDetails.address);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleShipment = async (id) => {
        if (!id) {
            return toast.warning("No order id", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
        }
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            const response = await axios.put('/api/shiporder', { order: id }, config);
            console.log(response);
            if (response?.data?.success) {
                toast.success(`Order # ${id} completed successfully`, {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
                fetchOrders(); // Re-fetch orders after successful shipment
            }
        } catch (error) {
            toast.error("Error updating shipment", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
        }
    };

    return (
        <>
            <main>
                <h2 className='font-semibold text-xl font-sans mb-3' style={{ letterSpacing: '2px' }}>All Orders</h2>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 700 }} aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>Product</StyledTableCell>
                                <StyledTableCell align="center">Name</StyledTableCell>
                                <StyledTableCell align="center">Quantity</StyledTableCell>
                                <StyledTableCell align="center">Price</StyledTableCell>
                                <StyledTableCell align="center">Amount Paid</StyledTableCell>
                                <StyledTableCell align="center">Client</StyledTableCell>
                                <StyledTableCell align="center">Status</StyledTableCell>
                                <StyledTableCell align="center">Shipping Address</StyledTableCell>
                                <StyledTableCell align="center">Action</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {allOrders.map((order) => (
                                order.orderItems.length > 0 ?
                                    order.orderItems.map((item) => (
                                        <StyledTableRow key={item._id}>
                                            <StyledTableCell component="th" scope="row">
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    width={50}
                                                    height={50}
                                                    className='bg-cover bg-no-repeat bg-center'
                                                />
                                            </StyledTableCell>
                                            <StyledTableCell align="center">{item.name.substring(0, 20)}...</StyledTableCell>
                                            <StyledTableCell align="center">{item.quantity}</StyledTableCell>
                                            <StyledTableCell align="center">{item.price}</StyledTableCell>
                                            <StyledTableCell align="center">{order.amountPaid}</StyledTableCell>
                                            <StyledTableCell align="center">
                                                <AccountCircleRoundedIcon onClick={() => handleClickOpen(order.userid)} />
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                {order.orderStatus === 'Processing' ? (
                                                    <span className='px-3 py-1 bg-orange-400 rounded-full text-white cursor-pointer'>{order.orderStatus}</span>
                                                ) : order.orderStatus === 'Canceled' ? (
                                                    <span className='px-3 py-1 bg-red-500 rounded-full text-white cursor-pointer'>{order.orderStatus}</span>
                                                ) : order.orderStatus === 'Completed' ? (
                                                    <span className='px-3 py-1 bg-green-400 rounded-full text-white cursor-pointer'>{order.orderStatus}</span>
                                                ) : null}
                                            </StyledTableCell>
                                            <StyledTableCell align="center">{order.shippingInfo}</StyledTableCell>
                                            <StyledTableCell align="center">
                                                {order.orderStatus === 'Processing' ? (
                                                    <span className='px-9 py-3 bg-blue-400 rounded text-white cursor-pointer' onClick={() => handleShipment(order._id)}>Ship</span>
                                                ) : order.orderStatus === 'Canceled' ? (
                                                    <span className='text-red-600 cursor-pointer'><CloseRoundedIcon /></span>
                                                ) : order.orderStatus === 'Completed' ? (
                                                    <span className=' text-green-600 cursor-pointer'><DoneAllRoundedIcon /></span>
                                                ) : null}
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    ))
                                    : <StyledTableRow key={order._id}>
                                        <StyledTableCell colSpan={7} align="center">No Orders found.</StyledTableCell>
                                    </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Dialog
                    open={open}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={handleClose}
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle>{"Customer Information Card"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                            <div className='flex flex-col gap-2'>
                                <p className='text-xs font-semibold'>Name</p>
                                <p className='font-semibold text-black'>{name}</p>
                                <p className='text-xs font-semibold'>Email</p>
                                <p>{email}</p>
                                <p className='text-xs font-semibold'>Phone</p>
                                <p>{phone}</p>
                                <div className='flex gap-9'>
                                    <div>
                                        <p className='text-xs font-semibold'>City</p>
                                        <p>{city}</p>
                                    </div>
                                    <div>
                                        <p className='text-xs font-semibold'>Country</p>
                                        <p>{country}</p>
                                    </div>
                                </div>
                                <p className='text-xs font-semibold'>Address</p>
                                <p>{address}</p>
                            </div>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <button className='m-4 text-green-600 font-semibold border py-2 px-4 rounded border-green-600 hover:text-white hover:bg-green-600 duration-300' onClick={handleClose}>Close</button>
                    </DialogActions>
                </Dialog>
                <ToastContainer pauseOnFocusLoss={false} />
            </main>
        </>
    );
}
