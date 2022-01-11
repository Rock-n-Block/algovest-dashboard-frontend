import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

export const MOCK_ACTION_FETCH = 'MOCK_ACTION_FETCH';
export const MOCK_ACTION_SUCCESS = 'MOCK_ACTION_SUCCESS';
export const MOCK_ACTION_ERROR = 'MOCK_ACTION_ERROR';

export interface MockActionAction {
  type: string;
  payload?: any;
  errorMessage?: Error;
}

const mockActionFetching = (): MockActionAction => ({
  type: MOCK_ACTION_FETCH,
});

const mockActionSuccess = (payload: any): MockActionAction => ({
  type: MOCK_ACTION_SUCCESS,
  payload,
});

const mockActionError = (error: Error): MockActionAction => ({
  type: MOCK_ACTION_ERROR,
  errorMessage: error,
});

export const mockActionRequest = (): ThunkAction<Promise<void>, {}, {}, AnyAction> => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    dispatch(mockActionFetching());
    // creating request
    await new Promise(function (resolve, reject) {
      if (2 < 5) resolve('2<5');
      else reject(new Error('2>5'));
    })
      .then((response) => {
        dispatch(mockActionSuccess(response));
      })
      .catch((error) => {
        dispatch(mockActionError(error));
      });
  };
};
