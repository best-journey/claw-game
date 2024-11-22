import { Button, Flex } from "@chakra-ui/react";
import { FC } from "react";

const ButtonsControl: FC<{
    onStart: () => void;
    onPick: () => void;
}> = ({ onStart, onPick }) => {
    return (
        <Flex position='absolute' zIndex={10} right='64px' bottom='64px' gap='16px'>
            <Button w='96px' h='96px' colorScheme="red" rounded='full' onClick={onStart}>
                Start
            </Button>
            <Button w='96px' h='96px' colorScheme="blue" rounded='full' onClick={onPick}>
                Pick
            </Button>
        </Flex>
    )
}

export default ButtonsControl;
