import * as React from "react";
import { Box, Flex, Heading } from "@chakra-ui/react";
import api from "../../services";
import { IUserInfo } from "../../interfaces";
import {
	Navbar,
	SearchInput,
	UserCard,
	UsersList,
} from "../../components";
import strings from "../../services/strings";

export const Home: React.FC = () => {
	const [ users, setUsers ] = React.useState<IUserInfo[]>([]);
	const [ newUsers, setNewUsers ] = React.useState<IUserInfo[]>([]);
	const [ pagination, setPagination ] = React.useState<number>(1);
	const [search, setSearch] = React.useState<string>("");
	const [showButtonPagination, setShowButtonPagination] = React.useState<boolean>(true);
	const twoSecondsInMiliSeconds = 2000;
	const pageStrings = strings.pages.home;

	React.useEffect(() => {
		const fetch = async () => {
			const user = await api.getAllUsers(pagination);
			setUsers(user.results);
		};
    
		fetch();
	}, [pagination]);

	const onGoNextPage = () => {
		if (pagination === 5) return ;
		setSearch("");
		setPagination(pagination + 1);
	};
	const onGoPreviousPage = () => {
		if (pagination === 1) return ;
		setSearch("");
		setPagination(pagination - 1);
	};


	const handleChange = (event: any) => {
		setSearch(event.target.value);

		setTimeout(() => {
			filterUsers();
		}, twoSecondsInMiliSeconds);
	};

	const searchToLowerCase = (str: string) => {
		const searchLowerCase = search.toLowerCase();
		return str.toLowerCase().includes(searchLowerCase);
	};

	const filterUsers = async () => {

		if (!search) {
			setShowButtonPagination(true);
		} else {
			setShowButtonPagination(false);
		}

		const usersFiltered = users.filter((userActual) => {
			return (
				searchToLowerCase(userActual.name.first)
            ||
			searchToLowerCase(userActual.name.last)
            ||
			searchToLowerCase(userActual.login.username)
            ||
			searchToLowerCase(userActual.email)
			);
		});
		setNewUsers(usersFiltered);
	};

	return (
		<>
			<Navbar />
			<Box w="100%" my={5} mr={12}>
				<Heading textAlign="center" pt={4}>{pageStrings.title}</Heading>
				<SearchInput
					placeholder={pageStrings.placeholder}
					onChange={handleChange}
					value={search}
				/>
				{
					users && !search ?  
						( 
							<UsersList 
								onGoNextPage={onGoNextPage}
								onGoPreviousPage={onGoPreviousPage}
								pagination={pagination}
								users={users}
								showButton={showButtonPagination}
							/>
						) : (
							<Box w="100%" textAlign="center">
								<Heading w="100%" textAlign="center" fontSize={18} my={3}>{pageStrings.findBy} {search}</Heading>
								<Flex wrap="wrap" justifyContent="center" alignItems="center" mt={5}>
									{
										newUsers.map((user: IUserInfo, index: number) => (
											<UserCard key={index} user={user} />
										))
									}
								</Flex>
							</Box>
            
						)
				}
			</Box>
		</>
	);
};
