const FooterComponent = () => {
    return (
        <footer>
            <span className="my-footer">
                Turf Management System | All Rights Reserved &copy; {new Date().getFullYear()}
            </span>
        </footer>
    );
};

export default FooterComponent;