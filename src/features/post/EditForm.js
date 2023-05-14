import { useCallback } from 'react'
import { Box, Card, alpha, Stack } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import RemoveCircleOutlineTwoToneIcon from '@mui/icons-material/RemoveCircleOutlineTwoTone'
import { FormProvider, FTextField, FUploadImage } from '../../components/form'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { LoadingButton } from '@mui/lab'
import { editPost } from './postSlice'
import Button from '@mui/material/Button'
const yupSchema = Yup.object().shape({
  content: Yup.string().required('Content is required')
})
function EditForm ({ post, cancelEdit }) {
  const { isLoading } = useSelector((state) => state.post)
  const defaultValues = {
    content: post.content,
    image: post.image
  }
  const methods = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues
  })
  const {
    handleSubmit,
    reset,
    setValue,
    watch
    // formState: { isSubmitting }
  } = methods
  const dataWatch = watch()
  const dispatch = useDispatch()
  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0]
      if (file) {
        setValue(
          'image',
          Object.assign(file, {
            preview: URL.createObjectURL(file)
          })
        )
      }
    },
    [setValue]
  )
  const onSubmit = (data) => {
    dispatch(editPost(data, post.author._id, post._id)).then(() => reset())
    cancelEdit()
  }
  return (
    <Card sx={{ p: 3 }}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <FTextField
            name='content'
            multiline
            fullWidth
            rows={4}
            // placeholder='Write something...'
            sx={{
              '& fieldset': {
                borderWidth: '1px !important',
                borderColor: alpha('#919EAB', 0.32)
              }
            }}
          />
          <Box position='relative'>
            <FUploadImage
              name='image'
              accept='image/*'
              maxSize={3145728}
              onDrop={handleDrop}
            />
            <IconButton
              onClick={() => setValue('image', null)}
              fontSize='large'
              sx={{
                color: '#e74c3c',
                position: 'absolute',
                zIndex: 2,
                top: 5,
                right: 5,
                display: dataWatch.image ? 'inline-block' : 'none'
              }}
            >
              <RemoveCircleOutlineTwoToneIcon />
            </IconButton>
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: 1
            }}
          >
            <LoadingButton
              type='submit'
              variant='contained'
              size='small'
              loading={isLoading}
            >
              Edit
            </LoadingButton>
            <Button onClick={cancelEdit} size='small' variant='contained'>
              Cancel
            </Button>
          </Box>
        </Stack>
      </FormProvider>
    </Card>
  )
}
export default EditForm
