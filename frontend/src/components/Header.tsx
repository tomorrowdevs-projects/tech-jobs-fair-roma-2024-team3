import { IoMdLogOut } from "react-icons/io"

interface Props {
    logout: () => void
    navigate: (route: string) => void
    username?: string
}

const Header = ({ logout, navigate, username }: Props) => {
    return (
        <div className="flex justify-between items-center w-full px-4 pt-4">
            {username && <p className="text-[40px] md:text-[50px] font-semibold">Hi, {username} &#128075;</p>}
            <button
                onClick={() => {
                    logout()
                    navigate("/")
                }}
                className="text-blue-500 p-1 border-2 border-blue-500 rounded-full"
            >
                <IoMdLogOut size={30} />
            </button>
        </div>
    )
}

export default Header