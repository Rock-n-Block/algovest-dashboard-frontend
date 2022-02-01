import React from 'react';

import cn from 'classnames';

import { Back } from 'assets/img';

import s from './Steps.module.scss';

interface ISteps {
  allSteps: number;
  currentStep: number;
  handleBack: (index: number) => void;
}

const Steps: React.VFC<ISteps> = ({ allSteps, currentStep, handleBack }) => {
  const handleClickBack = React.useCallback(() => {
    handleBack(currentStep - 1);
  }, [handleBack, currentStep]);

  return (
    <div className={s.steps}>
      {currentStep > 1 ? (
        <div
          className={s.back}
          onClick={handleClickBack}
          role="button"
          tabIndex={0}
          onKeyDown={() => {}}
        >
          <img src={Back} alt="" />
          <div className="text-smd">Go Back</div>
        </div>
      ) : null}
      <div className={s.steps__box}>
        {new Array(allSteps).fill(0).map((item, index) => (
          <div
            key={`${item + index}`}
            className={cn(s.item, {
              [s.item_active]: index + 1 <= currentStep,
            })}
          />
        ))}
      </div>
    </div>
  );
};

export default Steps;
