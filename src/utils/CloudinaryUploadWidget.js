import React, { Component, createRef } from 'react';
import { Button } from 'react-bootstrap';
import '../App.css';
import '../common/style/common.style.css';

const CLOUDNAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
const UPLOADPRESET = process.env.REACT_APP_CLOUDINARY_PRESET;

class CloudinaryUploadWidget extends Component {
   constructor(props) {
      super(props);
      this.uploadButtonRef = createRef();
   }

   componentDidMount() {
      this.myWidget = window.cloudinary.createUploadWidget(
         {
            cloudName: CLOUDNAME,
            uploadPreset: UPLOADPRESET,
         },
         (error, result) => {
            if (!error && result && result.event === 'success') {
               console.log('Cloudinary Upload Success:', result.info.secure_url);

               this.props.uploadImage(result.info.secure_url);
            } else if (error) {
               console.error('Cloudinary Upload Error:', error);
            }
         },
      );

      if (this.uploadButtonRef.current) {
         this.uploadButtonRef.current.addEventListener('click', () => this.myWidget.open());
      }
   }

   render() {
      return (
         <Button ref={this.uploadButtonRef} id='upload_widget' size='sm' className='ml-2'>
            Upload Image +
         </Button>
      );
   }
}

export default CloudinaryUploadWidget;
