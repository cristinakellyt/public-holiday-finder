type ApiResult<T> = Success<T> | Error<ErrorDetail>

enum ResultStatus {
  SUCCESS = 'success',
  ERROR = 'error',
}

type ErrorDetail = {
  message: string
  statusCode?: number
}

type Success<T> = {
  status: ResultStatus.SUCCESS
  data: T
}

type Error<ErrorDetail> = {
  status: ResultStatus.ERROR
  error: ErrorDetail
}

export type { ApiResult, Success, Error, ErrorDetail }
export { ResultStatus }
