import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Clock, CheckCircle, AlertCircle, Search, Filter, Edit, Trash2, Shield, User, Eye } from 'lucide-react';
import { ticketAPI, customerAPI } from '@/services/api';
import type { Ticket, Customer } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

const AdminTickets: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [ticketsPerPage] = useState(5);

  // Redirect non-admin users
  if (!isAdmin) {
    return (
      <Layout>
        <Card>
          <CardContent className="text-center py-12">
            <Shield className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-lg font-semibold mb-2">Access Denied</h3>
            <p className="text-muted-foreground">
              You don't have permission to view this page. Only administrators can manage all tickets.
            </p>
          </CardContent>
        </Card>
      </Layout>
    );
  }

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterTickets();
  }, [tickets, searchTerm, statusFilter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ticketsResponse, customersResponse] = await Promise.all([
        ticketAPI.getAll(),
        customerAPI.getAll()
      ]);
      
      setTickets(ticketsResponse.data);
      setCustomers(customersResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load tickets data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterTickets = () => {
    let filtered = tickets;

    if (searchTerm) {
      filtered = filtered.filter(ticket =>
        ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.customerId.includes(searchTerm)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.status === statusFilter);
    }

    setFilteredTickets(filtered);
  };

  const getCustomerName = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    return customer ? `${customer.firstName} ${customer.lastName}` : `Customer ${customerId}`;
  };

  const handleUpdateTicketStatus = async (ticketId: string, newStatus: 'Open' | 'In Progress' | 'Closed') => {
    try {
      await ticketAPI.update(ticketId, { status: newStatus });
      fetchData();
      
      toast({
        title: "Success",
        description: "Ticket status updated successfully"
      });
    } catch (error) {
      console.error('Error updating ticket:', error);
      toast({
        title: "Error",
        description: "Failed to update ticket status",
        variant: "destructive"
      });
    }
  };

  const handleDeleteTicket = async (ticketId: string) => {
    try {
      await ticketAPI.delete(ticketId);
      fetchData();
      
      toast({
        title: "Success",
        description: "Ticket deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting ticket:', error);
      toast({
        title: "Error",
        description: "Failed to delete ticket",
        variant: "destructive"
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Open':
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      case 'In Progress':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'Closed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/30 hover:bg-orange-500/30';
      case 'In Progress':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30 hover:bg-blue-500/30';
      case 'Closed':
        return 'bg-green-500/20 text-green-300 border-green-500/30 hover:bg-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30 hover:bg-gray-500/30';
    }
  };

  // Pagination logic
  const indexOfLastTicket = currentPage * ticketsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
  const currentTickets = filteredTickets.slice(indexOfFirstTicket, indexOfLastTicket);
  const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <Layout>
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Ticket Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage all customer support tickets across the system
          </p>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by title, description, or customer ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{tickets.length}</div>
              <p className="text-xs text-muted-foreground">Total Tickets</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-orange-500">
                {tickets.filter(t => t.status === 'Open').length}
              </div>
              <p className="text-xs text-muted-foreground">Open</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-500">
                {tickets.filter(t => t.status === 'In Progress').length}
              </div>
              <p className="text-xs text-muted-foreground">In Progress</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-500">
                {tickets.filter(t => t.status === 'Closed').length}
              </div>
              <p className="text-xs text-muted-foreground">Closed</p>
            </CardContent>
          </Card>
        </div>

        {/* Tickets List */}
        {filteredTickets.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <AlertCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-lg font-semibold mb-2">No tickets found</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'No tickets have been created yet'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="space-y-4">
              {currentTickets.map((ticket) => (
                <Card key={ticket.id} className="hover:shadow-lg transition-all duration-300 border-border/50">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="flex items-center space-x-2">
                          {getStatusIcon(ticket.status)}
                          <span>{ticket.title}</span>
                        </CardTitle>
                        <CardDescription className="mt-2 flex items-center space-x-4">
                          <span>Ticket #{ticket.id}</span>
                          <span>•</span>
                          <span className="flex items-center space-x-1">
                            <User className="w-3 h-3" />
                            <span>{getCustomerName(ticket.customerId)}</span>
                          </span>
                          <span>•</span>
                          <span>Created {new Date(ticket.createdAt).toLocaleDateString()}</span>
                        </CardDescription>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedTicket(ticket)}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle className="flex items-center space-x-2">
                                {getStatusIcon(ticket.status)}
                                <span>{ticket.title}</span>
                              </DialogTitle>
                              <DialogDescription>
                                Ticket #{ticket.id} • Created {new Date(ticket.createdAt).toLocaleDateString()}
                                <span className="ml-2">• Customer: {getCustomerName(ticket.customerId)}</span>
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label className="text-sm font-medium">Status</Label>
                                <div className="mt-1">
                                  <Badge className={`${getStatusColor(ticket.status)} transition-colors`}>
                                    {ticket.status}
                                  </Badge>
                                </div>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">Customer</Label>
                                <div className="mt-1 flex items-center space-x-2">
                                  <User className="w-4 h-4 text-muted-foreground" />
                                  <span>{getCustomerName(ticket.customerId)} (ID: {ticket.customerId})</span>
                                </div>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">Description</Label>
                                <div className="mt-1 p-3 bg-muted rounded-md">
                                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                    {ticket.description}
                                  </p>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <Label className="text-sm font-medium">Created</Label>
                                  <p className="text-muted-foreground">
                                    {new Date(ticket.createdAt).toLocaleDateString()} at {new Date(ticket.createdAt).toLocaleTimeString()}
                                  </p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Ticket ID</Label>
                                  <p className="text-muted-foreground">#{ticket.id}</p>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Select
                          value={ticket.status}
                          onValueChange={(newStatus: 'Open' | 'In Progress' | 'Closed') => 
                            handleUpdateTicketStatus(ticket.id, newStatus)
                          }
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Open">Open</SelectItem>
                            <SelectItem value="In Progress">In Progress</SelectItem>
                            <SelectItem value="Closed">Closed</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Ticket</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this ticket? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDeleteTicket(ticket.id)}
                                className="bg-destructive hover:bg-destructive/90"
                              >
                                Delete Ticket
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed mb-4 line-clamp-2">
                      {ticket.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge className={`${getStatusColor(ticket.status)} transition-colors`}>
                        {ticket.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Customer ID: {ticket.customerId}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => handlePageChange(page)}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default AdminTickets;