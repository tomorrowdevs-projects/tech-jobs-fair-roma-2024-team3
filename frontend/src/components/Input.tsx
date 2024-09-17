interface Props {
    id: string
    label: string
    name: string
    type?: string
    value?: string
    placeholder: string
    onChange: (name: string, value: string) => void
}

const Input = ({ id, label, name, type, value, placeholder, onChange }: Props) => (
    <>
        <label className="block text-gray-700 text-sm font-bold mb-2" >
            {label}
        </label>
        <input
            id={id}
            name={name}
            type={type}
            value={value}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder={placeholder}
            onChange={(e) => onChange(e.currentTarget.name, e.currentTarget.value)}
        />
    </>
)

export default Input