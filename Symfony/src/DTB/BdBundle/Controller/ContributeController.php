<?php

namespace DTB\BdBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use DTB\BdBundle\Entity\BandeDessinee;
use DTB\BdBundle\Form\BandeDessineeType;
use DTB\BdBundle\Entity\Planche;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

class ContributeController extends Controller
{
    public function indexAction()
    {
        if (!$this->get('security.context')->isGranted('IS_AUTHENTICATED_REMEMBERED')) {
            throw new AccessDeniedHttpException('You have to be logged in');
        }
        
        $bandeDessinees = $this->getDoctrine()
                ->getRepository('DTBBdBundle:BandeDessinee')
                ->findBy(array('creator' => $this->getUser()->getID()));
        
        return $this->render('DTBBdBundle:Contribute:index.html.twig', 
                array('bds' => $bandeDessinees));
    }
}
