'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';
import NewUploadImagesSheet from './sheet/new-upload-images-sheet';
import { useSearchParams } from 'next/navigation';
import useWorkspaceMyRole from '@/app/(workspace)/(workspace-main)/_hooks/use-workspace-my-role';

const NoResultDataItem = () => {
  const searchParams = useSearchParams();

  const [showNewUploadImagesSheet, setShowNewUploadImagesSheet] =
    useState(false);

  const { data: currentMyRole } = useWorkspaceMyRole();

  const isMyRoleOwnerOrManager =
    currentMyRole === 'OWNER' || currentMyRole === 'MANAGER';

  const datasetId = searchParams.get('datasetId');

  return (
    <div className="flex items-center justify-center w-full mt-12">
      <div className="flex items-center justify-center flex-col">
        <svg
          width="250"
          height="130"
          viewBox="0 0 260 130"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_5315_14214)">
            <path
              opacity="0.2"
              fillRule="evenodd"
              clipRule="evenodd"
              d="M65.5201 102.217H160.16C160.696 102.217 161.217 102.159 161.72 102.049C162.223 102.159 162.745 102.217 163.28 102.217H217.36C221.381 102.217 224.64 98.9576 224.64 94.937C224.64 90.9164 221.381 87.657 217.36 87.657H211.12C207.099 87.657 203.84 84.3976 203.84 80.377C203.84 76.3564 207.099 73.097 211.12 73.097H230.88C234.901 73.097 238.16 69.8376 238.16 65.817C238.16 61.7964 234.901 58.537 230.88 58.537H208C212.021 58.537 215.28 55.2776 215.28 51.257C215.28 47.2364 212.021 43.977 208 43.977H141.44C145.461 43.977 148.72 40.7176 148.72 36.697C148.72 32.6764 145.461 29.417 141.44 29.417H82.16C78.1394 29.417 74.8801 32.6764 74.8801 36.697C74.8801 40.7176 78.1394 43.977 82.16 43.977H40.5601C36.5394 43.977 33.2801 47.2364 33.2801 51.257C33.2801 55.2776 36.5394 58.537 40.5601 58.537H66.5601C70.5807 58.537 73.84 61.7964 73.84 65.817C73.84 69.8376 70.5807 73.097 66.5601 73.097H24.9601C20.9394 73.097 17.6801 76.3564 17.6801 80.377C17.6801 84.3976 20.9394 87.657 24.9601 87.657H65.5201C61.4994 87.657 58.2401 90.9164 58.2401 94.937C58.2401 98.9576 61.4994 102.217 65.5201 102.217ZM235.04 102.216C239.061 102.216 242.32 98.9569 242.32 94.9362C242.32 90.9156 239.061 87.6562 235.04 87.6562C231.019 87.6562 227.76 90.9156 227.76 94.9362C227.76 98.9569 231.019 102.216 235.04 102.216Z"
              fill="#6DACFF"
            ></path>
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M94.9759 101.947L91.2838 102.466C89.2994 102.745 87.4646 101.362 87.1857 99.3776L77.0859 27.5142C76.807 25.5298 78.1896 23.695 80.1741 23.4161L151.139 13.4426C153.124 13.1637 154.958 14.5463 155.237 16.5308C155.237 16.5308 155.883 21.1257 156.105 22.7062"
              fill="#fff"
            ></path>
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M97.268 97.9464L93.9154 98.4229C92.1134 98.6791 90.4496 97.4261 90.1993 95.6245L81.1325 30.3801C80.8821 28.5784 82.1399 26.9102 83.9419 26.6541L148.381 17.4951C150.183 17.239 151.847 18.4919 152.098 20.2936L152.877 25.9003C152.919 26.2037 155.702 46.3412 161.227 86.3129C161.505 88.3201 160.121 90.1746 158.136 90.4552C158.115 90.4582 158.093 90.4611 158.072 90.4637L97.268 97.9464Z"
              fill="#fff"
            ></path>
            <path
              d="M94.9759 101.947L91.2838 102.466C89.2994 102.745 87.4646 101.362 87.1857 99.3776L77.0859 27.5142C76.807 25.5298 78.1896 23.695 80.1741 23.4161L151.139 13.4426C153.124 13.1637 154.958 14.5463 155.237 16.5308C155.237 16.5308 155.883 21.1257 156.105 22.7062"
              stroke="#6DACFF"
              strokeWidth="2.2678"
              strokeLinecap="round"
            ></path>
            <path
              d="M156.861 26.8887L157.315 29.7193"
              stroke="#6DACFF"
              strokeWidth="2.2678"
              strokeLinecap="round"
            ></path>
            <path
              d="M110.003 28.3947L181.273 35.8854C182.643 36.0294 183.637 37.2569 183.493 38.6271L175.907 110.799C175.763 112.169 174.536 113.163 173.166 113.019L101.896 105.529C100.526 105.385 99.5316 104.157 99.6756 102.787L107.261 30.6148C107.405 29.2446 108.633 28.2507 110.003 28.3947Z"
              fill="#fff"
              stroke="#6DACFF"
              strokeWidth="2.2678"
            ></path>
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M113.494 38.5668C113.652 37.0721 114.991 35.9877 116.485 36.1448L173.321 42.1185C174.816 42.2756 175.9 43.6146 175.743 45.1094L170.717 92.9234C170.56 94.4181 169.221 95.5025 167.727 95.3454L110.891 89.3717C109.396 89.2146 108.312 87.8755 108.469 86.3808L113.494 38.5668Z"
              fill="#fff"
            ></path>
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M116.259 75.4173L125.147 69.423C126.628 68.4235 128.618 68.6521 129.834 69.9618L136.341 76.9675C136.666 77.3171 137.206 77.3553 137.577 77.0549L151.492 65.7797C153.168 64.4216 155.652 64.8172 156.824 66.6289L165.877 80.6324L167.178 82.8021L166.555 90.1722C166.512 90.6808 166.058 91.0538 165.551 90.9974L113.879 85.2565C113.388 85.2019 113.03 84.764 113.076 84.2717L113.761 76.8346L116.259 75.4173Z"
              fill="#fff"
            ></path>
            <path
              d="M116.367 37.2725L173.202 43.2462C174.074 43.3378 174.707 44.1189 174.615 44.9908L169.59 92.8048C169.498 93.6768 168.717 94.3093 167.845 94.2177L111.01 88.244C110.138 88.1524 109.505 87.3712 109.597 86.4993L114.622 38.6853C114.714 37.8134 115.495 37.1809 116.367 37.2725Z"
              stroke="#6DACFF"
              strokeWidth="2.2678"
            ></path>
            <circle
              cx="127.409"
              cy="53.7113"
              r="5.44272"
              transform="rotate(6 127.409 53.7113)"
              fill="#fff"
              stroke="#6DACFF"
              strokeWidth="2.2678"
            ></circle>
            <path
              d="M114.434 76.8196C118.005 74.3537 125.147 69.422 125.147 69.422C126.629 68.4225 128.618 68.6511 129.834 69.9608L136.341 76.9664C136.666 77.3161 137.206 77.3543 137.577 77.0539L151.492 65.7787C153.049 64.5171 155.334 64.7566 156.596 66.3136C156.677 66.4142 156.753 66.5191 156.824 66.6278C156.824 66.6278 164.959 79.5368 166.86 82.5532"
              stroke="#6DACFF"
              strokeWidth="2.2678"
              strokeLinecap="round"
            ></path>
          </g>
          <defs>
            <clipPath id="clip0_5315_14214">
              <rect width="260" height="130" fill="white"></rect>
            </clipPath>
          </defs>
        </svg>
        <h3 className="text-xl text-center font-bold mt-4">
          No file in this dataset
        </h3>
        {isMyRoleOwnerOrManager && (
          <>
            <p className="text-xs mt-4 text-center">
              Upload files in easily in this dataset and start working
            </p>
            <Button
              onClick={() => setShowNewUploadImagesSheet(true)}
              className="mt-4"
            >
              Upload images
            </Button>
          </>
        )}
      </div>
      {showNewUploadImagesSheet && (
        <NewUploadImagesSheet
          isOpen={showNewUploadImagesSheet}
          onClose={() => setShowNewUploadImagesSheet(false)}
          datasetId={datasetId as string}
        />
      )}
    </div>
  );
};

export default NoResultDataItem;
