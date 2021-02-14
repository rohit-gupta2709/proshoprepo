import React, { useEffect } from 'react'
import { Button, Table } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { listOrders } from '../actions/orderActions'

const OrderListScreen = ({history}) => {
    const dispatch = useDispatch()

    const orderList = useSelector(state => state.orderList)
    const { loading, error, orders } = orderList

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    useEffect(() => {
        
        if (userInfo && userInfo.isAdmin) {
            dispatch(listOrders())            
        } else {
            history.push('/login')
        }

    }, [dispatch, history, userInfo])


    return (
        <>
            { loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : (
                <>
                <h1>Orders</h1>
                <Table striped bordered hover responsive className='table-sm'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>PAYMENT METHOD</th>
                            <th>BUYER</th>
                            <th>PRICE</th>
                            <th>PAID</th>
                            <th>DELIVERED</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order._id}>
                                <td>{order._id}</td>
                                <td>{order.user.name}</td>
                                <td>{order.paymentMethod}</td>
                                <td>${order.totalPrice}</td>
                                <td>{order.isPaid ? <i class="fa fa-check" style={{color: 'green'}} aria-hidden="true"></i> : <i class="fa fa-times" aria-hidden="true"></i>}</td>
                                <td>{order.isDelivered ? <i class="fa fa-check" style={{color: 'red'}} aria-hidden="true"></i> : <i class="fa fa-times" aria-hidden="true"></i>}</td>
                                <td>
                                    <LinkContainer to={`/order/${order._id}`} >
                                        <Button variant='light' className='btn-sm'>
                                            Details
                                        </Button>
                                    </LinkContainer>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                </>
            )
        }
        </>
    )
}

export default OrderListScreen
