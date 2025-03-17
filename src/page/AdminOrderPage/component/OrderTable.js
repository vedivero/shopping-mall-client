import React from 'react';
import { Table, Badge } from 'react-bootstrap';
import { badgeBg, REVERSE_STATUS_MAP } from '../../../constants/order.constants';
import { currencyFormat } from '../../../utils/number';

const OrderTable = ({ header, data, openEditForm }) => {
   return (
      <div className='overflow-x'>
         <Table striped bordered hover>
            <thead>
               <tr>
                  {header.map((title, index) => (
                     <th key={index}>{title}</th>
                  ))}
               </tr>
            </thead>
            <tbody>
               {data.length > 0 ? (
                  data.map((item, index) => (
                     <tr key={index} onClick={() => openEditForm(item)} style={{ cursor: 'pointer' }}>
                        <th>{index}</th>
                        <th>{item.orderNum.toUpperCase()}</th>
                        <th>{item.createdAt.slice(0, 10)}</th>
                        <th>{item.userId.email}</th>
                        {item.items.length > 0 ? (
                           <th>
                              {item.items[0].productId.name}
                              {item.items.length > 1 && `외 ${item.items.length - 1}개`}
                           </th>
                        ) : (
                           <th></th>
                        )}

                        <th>{item.shipTo ? `${item.shipTo.address} ${item.shipTo.city}` : '주소 없음'}</th>

                        <th>{currencyFormat(item.totalPrice)}</th>
                        <th>
                           <Badge bg={badgeBg[item.status] || 'secondary'}>
                              {REVERSE_STATUS_MAP[item.status] || '알 수 없음'}
                           </Badge>
                        </th>
                     </tr>
                  ))
               ) : (
                  <tr>
                     <td colSpan='8' className='text-center'>
                        데이터가 없습니다.
                     </td>
                  </tr>
               )}
            </tbody>
         </Table>
      </div>
   );
};
export default OrderTable;
