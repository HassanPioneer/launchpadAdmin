import React, {useEffect, useState} from 'react';
import useStyles from "../style";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {renderErrorCreatePool} from "../../../utils/validate";

// CSS in /src/index.css

function PoolDescription(props: any) {
  const classes = useStyles();
  const {
    register, setValue, errors,
    poolDetail
  } = props;
  const renderError = renderErrorCreatePool;

  const defaultValue = '';
  const [description, setDescription] = useState(defaultValue);

  useEffect(() => {
    if (poolDetail && poolDetail.description) {
      setValue('description', poolDetail.description);
      setDescription(poolDetail.description);
    }
  }, [poolDetail]);

  const isDeployed = !!poolDetail?.is_deploy;

  return (
    <>
      <div className={classes.formCKEditor}>
        <label className={classes.formControlLabel}>About the pool: </label>

<CKEditor
  editor={ ClassicEditor }
  data={description}
  config={{
    mediaEmbed: {
        previewsInData: true
    }
  }}

  onReady={ (editor: any) => {
    // You can store the "editor" and use when it is needed.
    // console.log( 'Editor is ready to use!', editor );
  } }
  onChange={ ( event: any, editor: any ) => {
    const data = editor.getData();
    setDescription(data);
    setValue('description', data);  // save the value from the editor into the form
  } }
  onBlur={ ( event: any, editor: any ) => {
    // console.log( 'Blur.', editor );
  } }
  onFocus={ ( event: any, editor: any ) => {
    // console.log( 'Focus.', editor );
  } }
  // disabled={isDeployed}
/>

<input
  type="hidden"
  value={description}
  name="description"
  ref={register({
    // required: true
  })}
/>

{/* Other form inputs */}


        <p className={classes.formErrorMessage}>
          {
            renderError(errors, 'description')
          }
        </p>

      </div>
    </>
  );
}

export default PoolDescription;
