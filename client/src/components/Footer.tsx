
const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-200">
            <div className="container mx-auto px-4 py-4">
                <p className="text-black text-base font-semibold text-center">
                    Technical Assessment &copy; {new Date().getFullYear()}
                </p>
            </div>
        </footer>
    )
}

export default Footer