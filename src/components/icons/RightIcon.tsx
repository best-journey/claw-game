import { Box, BoxProps } from "@chakra-ui/react";

const RightIcon = ({ ...rest }: BoxProps) => {
    return (
        <Box {...rest}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <polygon points="0,0 0,12 12,6" fill="white" />
            </svg>
        </Box>
    )
}

export default RightIcon;