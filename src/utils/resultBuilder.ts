import { ResultStatus, type Success, type Error, type ErrorDetail } from '@/types/ApiResult'

export const successResult = <T>(data: T): Success<T> => {
  return {
    status: ResultStatus.SUCCESS,
    data,
  }
}

export const errorResult = (message: string, statusCode?: number): Error<ErrorDetail> => {
  return {
    status: ResultStatus.ERROR,
    error: {
      message,
      statusCode,
    },
  }
}
