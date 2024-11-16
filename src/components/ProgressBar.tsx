import { Box } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

export interface IProgressBarProps {
    progress: number;
    size?: string;
}

const ProgressBar: React.FC<IProgressBarProps> = ({ progress }) => {
    return (
        <Box w='360px' h='32px' bgGradient='linear(to-b, #191c23, #2d3341)' rounded='full' overflow='hidden' border='4px solid #242b35'>
            <MotionBox
                w="full"
                h="full"
                bgGradient="linear(to-r, #433485, #dd3c6e)"
                rounded="full"
                width={`${progress}%`}
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
            >
                <Box w='full' h='full' bgGradient='linear(to-b, #d0a9e280, #dd3c6e80)' shadow='inset 0 2px 2px 0 #fff4' rounded='full' />
            </MotionBox>
        </Box>
    );
};

export default ProgressBar;