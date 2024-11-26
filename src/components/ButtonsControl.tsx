import { Button, Flex } from "@chakra-ui/react";
import { FC } from "react";

const ButtonsControl: FC<{
    onStart: () => void;
    onPick: () => void;
}> = ({ onStart, onPick }) => {
    return (
        <Flex position='absolute' zIndex={10} right={{ base: '16px', lg: '64px' }} bottom={{ base: '16px', lg: '64px' }} gap={{ base: '8px', lg: '16px' }}>
            <Button w='80px' h='80px' colorScheme="red" rounded='full' onClick={onStart}>
                Start
            </Button>
            <Button w='80px' h='80px' colorScheme="blue" rounded='full' onClick={onPick}>
                Pick
            </Button>
        </Flex>
    )
}

export default ButtonsControl;
