import moment from "moment";

type Props = {
  date: Date;
  isEnrolled?: boolean;
  isSelected?: boolean;
}

export default function DayButton(props: Props) {

  const isToday = moment(props.date).isSame(moment(), 'day');

  return (
    <div className={`${isToday || props.isSelected ? 'border-primary' : 'border-white'} ${props.isSelected ? 'bg-primary text-white' : 'bg-white'} border-[1.5px] text-center shadow-md pt-1.5 pb-1.5 px-2 rounded-[20px]`}>
      <div className="flex items-center justify-center mb-1.5">
        <div className={`${props.isEnrolled ? 'bg-brand-500' : ''} size-2 rounded-full`} />
      </div>
      <div className="text-brand-neutral-500 uppercase text-[10px] font-medium leading-[1]">{moment(props.date).format('ddd')}</div>
      <div className="text-lg">{moment(props.date).format('DD')}</div>
    </div>
  )
}