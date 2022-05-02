import { Spin } from "antd";

const Loader = (props) => {
	return (
		<div className="loader-antd">
			<Spin {...props} />
		</div>
	);
};
export default Loader;
