import { Button, Flex } from "@chakra-ui/react"

export default function () {
    return (
        <Flex position='absolute' zIndex={10} right='64px' bottom='64px' gap='16px'>
            <Button w='96px' h='96px' colorScheme="red" rounded='full'>
                Start
            </Button>
            <Button w='96px' h='96px' colorScheme="blue" rounded='full'>
                Pick
            </Button>
        </Flex>
    )
}