import { useState } from 'react'
import {
  Avatar,
  Box,
  Paper,
  Stack,
  Typography,
  IconButton,
  Dialog,
  DialogActions,
  Button,
  DialogContent,
  DialogContentText
} from '@mui/material'
import { fDate } from '../../utils/formatTime'
import CommentReaction from './CommentReaction'
import DeleteIcon from '@mui/icons-material/Delete'
import { useDispatch } from 'react-redux'
import { deleteComment } from './commentSlice'
import useAuth from '../../hooks/useAuth'
function AlertDialog ({ open, handleClose, handleDeleteComment }) {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
    >
      <DialogContent>
        <DialogContentText id='alert-dialog-description'>
          Click OK to delete
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleDeleteComment}>Ok</Button>
      </DialogActions>
    </Dialog>
  )
}
function CommentCard ({ comment }) {
  const [openAlert, setOpenAlert] = useState(false)
  const { user } = useAuth()
  const dispatch = useDispatch()
  const handleDeleteComment = () => {
    dispatch(deleteComment(comment._id))
  }
  return (
    <Stack direction='row' spacing={2}>
      <AlertDialog
        open={openAlert}
        handleClose={() => setOpenAlert(false)}
        handleDeleteComment={handleDeleteComment}
      />
      <Avatar alt={comment.author?.name} src={comment.author?.avatarUrl} />
      <Paper sx={{ p: 1.5, flexGrow: 1, bgcolor: 'background.neutral' }}>
        <Stack
          direction='row'
          alignItems={{ sm: 'center' }}
          justifyContent='space-between'
          sx={{ mb: 0.5 }}
        >
          <Typography variant='subtitle2' sx={{ fontWeight: 600 }}>
            {comment.author?.name}
          </Typography>
          <Typography variant='caption' sx={{ color: 'text.disabled' }}>
            {fDate(comment.createdAt)}
          </Typography>
        </Stack>
        <Typography variant='body2' sx={{ color: 'text.secondary' }}>
          {comment.content}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center'
          }}
        >
          <CommentReaction comment={comment} />
          {user._id === comment.author._id ? (<IconButton
            aria-label='Delete'
            size='small'
            onClick={() => setOpenAlert(true)}
                                              >
            <DeleteIcon />
          </IconButton>) : (<></>)}
        </Box>
      </Paper>
    </Stack>
  )
}
export default CommentCard
