import { Link, Outlet } from '@tanstack/react-router'
import { AppBar, Toolbar, Typography, Container, Box } from '@mui/material'

function RootLayout() {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            TMT Client
          </Typography>
          <Link
            to="/google-map/$id"
            params={{ id: '2025-11-4-4445' }}
            style={{ color: 'inherit', textDecoration: 'none', marginRight: 16 }}
          >
            Google Map
          </Link>
          <Link
            to="/ola-map/$id"
            params={{ id: '2025-11-4-4445' }}
            style={{ color: 'inherit', textDecoration: 'none' }}
          >
            Ola Map
          </Link>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Outlet />
        </Box>
      </Container>
    </>
  )
}

export default RootLayout
