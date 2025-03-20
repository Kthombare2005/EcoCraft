import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  Typography, 
  Box, 
  Chip,
  Grid,
  Divider,
  IconButton
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { format } from 'date-fns';

const RequestDetailsDialog = ({ open, onClose, requestDetails }) => {
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    if (timestamp.toDate) {
      return format(timestamp.toDate(), 'MMM d, yyyy, h:mm a');
    }
    return timestamp;
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          background: 'linear-gradient(to bottom, #ffffff, #f5f5f5)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        background: 'linear-gradient(45deg, #004080, #0066cc)',
        color: 'white',
        py: 2
      }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Request Details
        </Typography>
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* Scrap Information Section */}
          <Grid item xs={12}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ 
                color: '#004080',
                fontWeight: 600,
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                '&::after': {
                  content: '""',
                  flex: 1,
                  ml: 2,
                  height: '2px',
                  background: 'linear-gradient(to right, #004080, transparent)'
                }
              }}>
                Scrap Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Typography variant="subtitle2" color="text.secondary">Type</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {requestDetails?.type || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="subtitle2" color="text.secondary">Quantity</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {requestDetails?.quantity ? `${requestDetails.quantity} kg` : 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="subtitle2" color="text.secondary">Price</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {requestDetails?.price || 'N/A'}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
          </Grid>

          {/* Scraper Information Section */}
          <Grid item xs={12}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ 
                color: '#004080',
                fontWeight: 600,
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                '&::after': {
                  content: '""',
                  flex: 1,
                  ml: 2,
                  height: '2px',
                  background: 'linear-gradient(to right, #004080, transparent)'
                }
              }}>
                Scraper Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Name</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {requestDetails?.name || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Contact</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {requestDetails?.contact || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {requestDetails?.email || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Address</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {requestDetails?.address || 'N/A'}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
          </Grid>

          {/* Timeline Section */}
          <Grid item xs={12}>
            <Box>
              <Typography variant="h6" sx={{ 
                color: '#004080',
                fontWeight: 600,
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                '&::after': {
                  content: '""',
                  flex: 1,
                  ml: 2,
                  height: '2px',
                  background: 'linear-gradient(to right, #004080, transparent)'
                }
              }}>
                Request Timeline
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Typography variant="subtitle2" color="text.secondary">Scheduled For</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {formatDate(requestDetails?.scheduledDateTime)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="subtitle2" color="text.secondary">Created On</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {formatDate(requestDetails?.createdOn)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="subtitle2" color="text.secondary">Action Taken On</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {formatDate(requestDetails?.updatedAt)}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ mt: 2 }}>
                    <Chip 
                      label="DECLINED"
                      color="error"
                      sx={{ 
                        fontWeight: 600,
                        borderRadius: 1,
                        px: 1
                      }}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default RequestDetailsDialog; 