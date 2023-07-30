import React, {useEffect, useState} from 'react';
import useStyles from "../style";
import CKEditor from 'ckeditor4-react';
import {renderErrorCreatePool} from "../../../utils/validate";

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
          data={description}
          onChange={ evt => {
              const data = evt.editor.getData();
              setDescription(data);
          }}
          readOnly={isDeployed}
        />

        <input
          type="hidden"
          value={description}
          name="description"
          ref={register}
        />

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
