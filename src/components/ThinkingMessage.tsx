interface Props {
  message: string
}

const ThinkingMessage = ({ message }: Props) => (
  <div className='thinking-message'>{message}</div>
)

export default ThinkingMessage
