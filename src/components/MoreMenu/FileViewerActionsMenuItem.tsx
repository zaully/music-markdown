import ShareIcon from "@mui/icons-material/Share";
import { Box, Button, Stack } from "@mui/material";

interface ShareButtonProps {
    closeMenu: () => void;
    openQrCodeDialog: () => void;
  }

  const ShareButton = ({ closeMenu, openQrCodeDialog }: ShareButtonProps) => {
    const handleOpen = () => {
      closeMenu();
      openQrCodeDialog();
    };

    return (
      <Button variant="outlined" startIcon={<ShareIcon />} onClick={handleOpen}>
        Share song list
      </Button>
    );
  };

interface FileViewerActionsMenuItemProps {
    closeMenu: () => void;
    openQrCodeDialog: () => void;
}

export default function FileViewerActionsMenuItem({
    closeMenu,
    openQrCodeDialog,
  }: FileViewerActionsMenuItemProps) {
    return (
      <Box>
        <Stack direction="column" spacing={1}>
          <ShareButton
            closeMenu={closeMenu}
            openQrCodeDialog={openQrCodeDialog}
          />
        </Stack>
      </Box>
    );
  }
