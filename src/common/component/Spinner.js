import React from 'react';
import { ColorRing } from 'react-loader-spinner';

const Spinner = ({
   visible = true,
   height = 80,
   width = 80,
   colors = ['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87'],
}) => {
   return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100px' }}>
         <ColorRing
            visible={visible}
            height={height}
            width={width}
            ariaLabel='loading-spinner'
            colors={colors}
         />
      </div>
   );
};

export default Spinner;
